import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function POST(req: Request) {

  const { name, cost, category } = await req.json();
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price:cost,
        category,
      },
    });

    return new Response(
        JSON.stringify({ message: "Product created successfully", product }),
        { status: 201 }
      );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
        status: 500,
      });
  }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
  
    if (id) {
      return getProductById(Number(id));
    } else {
      return getAllProducts();
    }
  }
  
  async function getProductById(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
  
      if (!product) {
        return new Response(
          JSON.stringify({ error: "Product not found" }),
          { status: 404 }
        );
      }
  
      return new Response(
        JSON.stringify(product),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error }),
        { status: 500 }
      );
    }
  }
  
  async function getAllProducts() {
    try {
      const products = await prisma.product.findMany();
      return new Response(
        JSON.stringify(products),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error }),
        { status: 500 }
      );
    }
  }
